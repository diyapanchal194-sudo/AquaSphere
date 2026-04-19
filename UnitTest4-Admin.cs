using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere.Models;

namespace AquaSphere.UnitTests
{
    [TestClass]
    public class AdminTests
    {
        // Test 9: admin property integrity check 
        [TestMethod]
        public void AdminModel_PropertyValidation_Test()
        {
            // verifying that the Admin model correctly maps and retrieves IDs, emails, and secure password hashes.
            var admin = new Admin();
            int testId = 1;
            string testEmail = "admin@aquasphere.com";
            string testHash = "pbkdf2_sha256$20000$salt$hash123";

            admin.Id = testId;
            admin.Email = testEmail;
            admin.PasswordHash = testHash;

            Assert.AreEqual(testId, admin.Id, "The ID property failed to store the integer correctly.");
            Assert.AreEqual(testEmail, admin.Email, "The Email property failed to store the string correctly.");
            Assert.AreEqual(testHash, admin.PasswordHash, "The PasswordHash integrity check failed.");
        }

        // Test 10: admin null data handling
        [TestMethod]
        public void AdminModel_NullEmail_Test()
        {
            // Testing if the model handles null values without crashing, which is important for incomplete database records.
            var admin = new Admin { Email = null };

            Assert.IsNull(admin.Email, "The model should allow a null Email value for flexibility.");
        }
    }
}
