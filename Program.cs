// ============================================================
//  AquaSphere - Swimming Pool Membership Website
//  Program.cs - ASP.NET Core entry point
//
//  This file configures and starts the web server.
//  It serves static files (HTML, CSS, JS) from wwwroot/
//  and falls back to index.html for any unknown route,
//  allowing the client-side JavaScript router in app.js
//  to handle all page navigation without full page reloads.
// ============================================================

var builder = WebApplication.CreateBuilder(args);

// Build the web application (no additional services needed
// for a static file site — no controllers, no Razor Pages).
var app = builder.Build();

// ----------------------------------------------------------
// Middleware: serve static files from wwwroot/
// UseDefaultFiles() makes "/" serve "index.html" automatically.
// UseStaticFiles() serves CSS, JS, images, etc.
// ----------------------------------------------------------
app.UseDefaultFiles();   // maps "/" → "/index.html"
app.UseStaticFiles();    // serves wwwroot files directly

// ----------------------------------------------------------
// SPA fallback: any request that is NOT a static file
// (e.g. browser refresh on a deep link) returns index.html.
// The JavaScript router in app.js then handles the route.
// ----------------------------------------------------------
app.MapFallbackToFile("index.html");

// Start the server
app.Run();
