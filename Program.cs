using System.Security.Cryptography;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

SetupDatabase();

app.UseDefaultFiles();
app.UseStaticFiles();

/* ===========================
   MEMBER SIGNUP API
=========================== */
app.MapPost("/api/member/signup", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<MemberSignupRequest>();

    if (request == null)
        return Results.BadRequest(new { message = "Invalid request data." });

    if (string.IsNullOrWhiteSpace(request.FirstName) ||
        string.IsNullOrWhiteSpace(request.LastName) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { message = "First name, last name, email, and password are required." });
    }

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var checkCommand = connection.CreateCommand();
    checkCommand.CommandText = "SELECT COUNT(1) FROM Members WHERE Email = $email;";
    checkCommand.Parameters.AddWithValue("$email", request.Email.Trim().ToLower());

    var existingCount = Convert.ToInt32(checkCommand.ExecuteScalar());
    if (existingCount > 0)
        return Results.BadRequest(new { message = "Email already exists." });

    var hashedPassword = HashPassword(request.Password);

    var insertCommand = connection.CreateCommand();
    insertCommand.CommandText = @"
        INSERT INTO Members (FirstName, LastName, Email, Phone, PasswordHash, JoinDate)
        VALUES ($firstName, $lastName, $email, $phone, $passwordHash, $joinDate);
    ";

    insertCommand.Parameters.AddWithValue("$firstName", request.FirstName.Trim());
    insertCommand.Parameters.AddWithValue("$lastName", request.LastName.Trim());
    insertCommand.Parameters.AddWithValue("$email", request.Email.Trim().ToLower());
    insertCommand.Parameters.AddWithValue("$phone", request.Phone?.Trim() ?? "");
    insertCommand.Parameters.AddWithValue("$passwordHash", hashedPassword);
    insertCommand.Parameters.AddWithValue("$joinDate", DateTime.UtcNow.ToString("yyyy-MM-dd"));

    insertCommand.ExecuteNonQuery();

    return Results.Ok(new { message = "Member signup successful." });
});

/* ===========================
   MEMBER LOGIN API
=========================== */
app.MapPost("/api/member/login", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<MemberLoginRequest>();

    if (request == null)
        return Results.BadRequest(new { message = "Invalid request data." });

    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.BadRequest(new { message = "Email and password are required." });

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var command = connection.CreateCommand();
    command.CommandText = @"
        SELECT Id, FirstName, LastName, Email, PasswordHash
        FROM Members
        WHERE Email = $email;
    ";
    command.Parameters.AddWithValue("$email", request.Email.Trim().ToLower());

    using var reader = command.ExecuteReader();

    if (!reader.Read())
        return Results.BadRequest(new { message = "Invalid email or password." });

    var storedPasswordHash = reader["PasswordHash"]?.ToString();

    if (string.IsNullOrWhiteSpace(storedPasswordHash) ||
        !VerifyPassword(request.Password, storedPasswordHash))
    {
        return Results.BadRequest(new { message = "Invalid email or password." });
    }

    return Results.Ok(new
    {
        message = "Login successful.",
        member = new
        {
            Id = reader["Id"],
            FirstName = reader["FirstName"],
            LastName = reader["LastName"],
            Email = reader["Email"]
        }
    });
});

app.Run();

/* ===========================
   DATABASE SETUP
=========================== */
void SetupDatabase()
{
    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var command = connection.CreateCommand();
    command.CommandText = @"
        CREATE TABLE IF NOT EXISTS Members (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            FirstName TEXT NOT NULL,
            LastName TEXT NOT NULL,
            Email TEXT UNIQUE NOT NULL,
            Phone TEXT,
            PasswordHash TEXT NOT NULL,
            JoinDate TEXT NOT NULL
        );
    ";

    command.ExecuteNonQuery();
}

/* ===========================
   PASSWORD HASHING
=========================== */
string HashPassword(string password)
{
    byte[] salt = RandomNumberGenerator.GetBytes(16);
    const int iterations = 100_000;

    byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
        password,
        salt,
        iterations,
        HashAlgorithmName.SHA256,
        32);

    return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
}

bool VerifyPassword(string password, string storedHash)
{
    var parts = storedHash.Split('.');
    if (parts.Length != 3)
        return false;

    int iterations = int.Parse(parts[0]);
    byte[] salt = Convert.FromBase64String(parts[1]);
    byte[] expectedHash = Convert.FromBase64String(parts[2]);

    byte[] actualHash = Rfc2898DeriveBytes.Pbkdf2(
        password,
        salt,
        iterations,
        HashAlgorithmName.SHA256,
        expectedHash.Length);

    return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
}

/* ===========================
   REQUEST MODELS
=========================== */
class MemberSignupRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Password { get; set; }
}

class MemberLoginRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}