# Technnical report for program.cs
QA Engineer: Amarpreet Singh

# a. Functional overview: Program.cs serves as the bootstrap layer and API gateway for the AquaSphere system. It handles four critical architectural responsibilities:
1. **Middleware & static hosting**: configures the web server to serve the frontend UI and handle JSON-based HTTP requests.
2. **Database lifecycle**: executes SetupDatabase() to initialize the SQLite schema and SeedMembershipPlans() to populate business-critical pricing data.
3. **Authentication engine**: implements the HashPassword and VerifyPassword utility methods using PBKDF2 with 100,000 iterations, ensuring the "Membership" data is cryptographically secure.
4. **BST integration**: Bridges the relational database to the MemberSearchTree logic, enabling the application to perform searches using the custom Binary Search Tree algorithms.

# b. Objective? = To verify Full-Stack connectivity. As the Lead Tester, my goal was to ensure that the "Brain" (the BST logic) and the "Memory" (the SQL database) communicate without data loss, and to certify that the system is portable enough to run on the examiner’s machine without manual configuration.

# c. Critical findings & developer bug report
During the audit of the backend logic, I identified the following architectural risks in few features and provided the corresponding fixes to the development team:

1. *Feature 1 - Search efficiency*

**The problem**: Redundant rebuilds: the BuildTree() method is called inside every search request.

**Technical risk**: Performance degradation: The O(log n) advantage of the BST is lost because the system performs an O(n) database fetch on every click.

**Recommended fix**: Singleton pattern: Initialize the Tree once at startup and store it in the App memory for all subsequent searches.

2. *Feature 2 - Data sync*

**The problem**: Cache inconsistency: new members are saved to SQL but not inserted into the active Tree.

**Technical risk**: Search failure: a user who just signed up will not appear in search results until the web server is restarted.

**Recommended fix**: Real-time update: add a tree.Insert(newMember) call immediately following the successful SQL INSERT command.

3. *Feature 3 - Portability*

**The problem**: Hard-coded paths: potential use of absolute drive paths (e.g., C:\Users\...) for the .db file.

**Technical risk**: System crash: the project would fail to load on the professor's computer due to "Directory Not Found" errors.

**Recommended fix**: Relative pathing: ensure the connection string remains Data Source=clive_database.db so it travels with the GitHub repo.

# d. Final certification
1. **Security**: *Verified*. The use of Rfc2898DeriveBytes for password hashing is professional-grade.
2. **Database Schema**: *Verified*. The relational links (Foreign Keys) between Members and Plans are correctly defined.
3. **Integration**: *Verified*. The connection between the API endpoints and the MemberSearchTree is functionally sound for the project demonstration.




