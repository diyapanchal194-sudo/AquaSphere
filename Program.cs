using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Create database/table when app starts
SetupDatabase();

app.UseDefaultFiles();
app.UseStaticFiles();

// Signup API
app.MapPost("/signup", async (HttpContext context) =>
{
    var user = await context.Request.ReadFromJsonAsync<User>();

    if (user == null)
    {
        return Results.BadRequest("Invalid data.");
    }

    using var connection = new SqliteConnection("Data Source=clive_database.db");
    connection.Open();

    var command = connection.CreateCommand();
    command.CommandText = @"
        INSERT INTO Users (FullName, Email, Password, Role)
        VALUES ($name, $email, $password, $role);
    ";

    command.Parameters.AddWithValue("$name", user.FullName);
    command.Parameters.AddWithValue("$email", user.Email);
    command.Parameters.AddWithValue("$password", user.Password);
    command.Parameters.AddWithValue("$role", user.Role);

    command.ExecuteNonQuery();

    return Results.Ok("User created successfully.");
});

app.Run();

void SetupDatabase()
{
    string connectionString = "Data Source=clive_database.db";

    using (var connection = new SqliteConnection(connectionString))
    {
        connection.Open();

        string createTableQuery = @"
            CREATE TABLE IF NOT EXISTS Users (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                FullName TEXT NOT NULL,
                Email TEXT NOT NULL UNIQUE,
                Password TEXT NOT NULL,
                Role TEXT NOT NULL
            );
        ";

        using (var command = new SqliteCommand(createTableQuery, connection))
        {
            command.ExecuteNonQuery();
        }
    }
}

class User
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
}