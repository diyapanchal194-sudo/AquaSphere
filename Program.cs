using System.Security.Cryptography;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

SetupDatabase();

app.UseDefaultFiles();
app.UseStaticFiles();

/* ===========================
   MEMBER SIGNUP
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
        return Results.BadRequest(new { message = "All required fields must be filled." });
    }

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var check = connection.CreateCommand();
    check.CommandText = "SELECT COUNT(1) FROM Members WHERE Email = $email;";
    check.Parameters.AddWithValue("$email", request.Email.ToLower());

    if (Convert.ToInt32(check.ExecuteScalar()) > 0)
        return Results.BadRequest(new { message = "Email already exists." });

    var insert = connection.CreateCommand();
    insert.CommandText = @"
        INSERT INTO Members (FirstName, LastName, Email, Phone, PasswordHash, JoinDate)
        VALUES ($fn, $ln, $em, $ph, $pw, $jd);
    ";

    insert.Parameters.AddWithValue("$fn", request.FirstName);
    insert.Parameters.AddWithValue("$ln", request.LastName);
    insert.Parameters.AddWithValue("$em", request.Email.ToLower());
    insert.Parameters.AddWithValue("$ph", request.Phone ?? "");
    insert.Parameters.AddWithValue("$pw", HashPassword(request.Password));
    insert.Parameters.AddWithValue("$jd", DateTime.UtcNow.ToString("yyyy-MM-dd"));

    insert.ExecuteNonQuery();

    return Results.Ok(new { message = "Member signup successful." });
});

/* ===========================
   MEMBER LOGIN
=========================== */
app.MapPost("/api/member/login", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<MemberLoginRequest>();

    if (request == null)
        return Results.BadRequest(new { message = "Invalid request." });

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT * FROM Members WHERE Email = $email;";
    cmd.Parameters.AddWithValue("$email", request.Email.ToLower());

    using var reader = cmd.ExecuteReader();

    if (!reader.Read())
        return Results.BadRequest(new { message = "Invalid email or password." });

    var storedHash = reader["PasswordHash"].ToString();

    if (!VerifyPassword(request.Password, storedHash))
        return Results.BadRequest(new { message = "Invalid email or password." });

    return Results.Ok(new
    {
        message = "Login successful",
        member = new
        {
            Id = reader["Id"],
            FirstName = reader["FirstName"],
            LastName = reader["LastName"],
            Email = reader["Email"]
        }
    });
});

/* ===========================
   STAFF SIGNUP
=========================== */
app.MapPost("/api/staff/signup", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<StaffRequest>();

    if (request == null)
        return Results.BadRequest(new { message = "Invalid request." });

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var check = connection.CreateCommand();
    check.CommandText = "SELECT COUNT(1) FROM Staff WHERE Email = $email;";
    check.Parameters.AddWithValue("$email", request.Email.ToLower());

    if (Convert.ToInt32(check.ExecuteScalar()) > 0)
        return Results.BadRequest(new { message = "Staff already exists." });

    var insert = connection.CreateCommand();
    insert.CommandText = @"
        INSERT INTO Staff (FullName, Email, PasswordHash)
        VALUES ($name, $email, $pass);
    ";

    insert.Parameters.AddWithValue("$name", request.FullName);
    insert.Parameters.AddWithValue("$email", request.Email.ToLower());
    insert.Parameters.AddWithValue("$pass", HashPassword(request.Password));

    insert.ExecuteNonQuery();

    return Results.Ok(new { message = "Staff account created." });
});

/* ===========================
   STAFF LOGIN
=========================== */
app.MapPost("/api/staff/login", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<LoginRequest>();

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT * FROM Staff WHERE Email = $email;";
    cmd.Parameters.AddWithValue("$email", request.Email.ToLower());

    using var reader = cmd.ExecuteReader();

    if (!reader.Read())
        return Results.BadRequest(new { message = "Invalid login." });

    if (!VerifyPassword(request.Password, reader["PasswordHash"].ToString()))
        return Results.BadRequest(new { message = "Invalid login." });

    return Results.Ok(new { message = "Staff login successful." });
});

/* ===========================
   ADMIN LOGIN
=========================== */
app.MapPost("/api/admin/login", async (HttpContext context) =>
{
    var request = await context.Request.ReadFromJsonAsync<LoginRequest>();

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT * FROM Admins WHERE Email = $email;";
    cmd.Parameters.AddWithValue("$email", request.Email.ToLower());

    using var reader = cmd.ExecuteReader();

    if (!reader.Read())
        return Results.BadRequest(new { message = "Invalid admin login." });

    if (!VerifyPassword(request.Password, reader["PasswordHash"].ToString()))
        return Results.BadRequest(new { message = "Invalid admin login." });

    return Results.Ok(new { message = "Admin login successful." });
});

app.Run();

/* ===========================
   DATABASE SETUP
=========================== */
void SetupDatabase()
{
    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var cmd = connection.CreateCommand();
    cmd.CommandText = @"
        CREATE TABLE IF NOT EXISTS Admins (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Email TEXT UNIQUE,
            PasswordHash TEXT
        );

        CREATE TABLE IF NOT EXISTS Staff (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            FullName TEXT,
            Email TEXT UNIQUE,
            PasswordHash TEXT
        );

        CREATE TABLE IF NOT EXISTS Members (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            FirstName TEXT,
            LastName TEXT,
            Email TEXT UNIQUE,
            Phone TEXT,
            PasswordHash TEXT,
            JoinDate TEXT
        );
    ";
    cmd.ExecuteNonQuery();
}

/* ===========================
   SECURITY
=========================== */
string HashPassword(string password)
{
    byte[] salt = RandomNumberGenerator.GetBytes(16);
    byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);
    return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
}

bool VerifyPassword(string password, string stored)
{
    var parts = stored.Split('.');
    var salt = Convert.FromBase64String(parts[0]);
    var hash = Convert.FromBase64String(parts[1]);

    var newHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);
    return CryptographicOperations.FixedTimeEquals(hash, newHash);
}

/* ===========================
   MODELS
=========================== */
class MemberSignupRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Password { get; set; }
}

class MemberLoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

class StaffRequest
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}