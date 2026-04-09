using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere.Models;

namespace AquaSphere.UnitTests
{
    [TestClass]
    public class AdminTests
    {
        /// This test ensures the basic Admin model can hold data correctly.
        /// I am testing the ID, Email, and PasswordHash properties to make sure they don't truncate or change the data once assigne
        [TestMethod]
        public void AdminModel_PropertyValidation_Test()
        {
            // Arrange: Initializing the model and defining test values
            var admin = new Admin();
            int testId = 1;
            string testEmail = "admin@aquasphere.com";

            // Testing with a complex string to simulate a real hashed password
            string testHash = "pbkdf2_sha256$20000$salt$hash123";

            // Act: Assigning the test values to the Admin object properties
            admin.Id = testId;
            admin.Email = testEmail;
            admin.PasswordHash = testHash;

            // assert: Verifying that the data retrieved matches our original input
            // Each assert check ensures one specific part of the model is reliable
            Assert.AreEqual(testId, admin.Id, "The ID property failed to store the integer correctly.");
            Assert.AreEqual(testEmail, admin.Email, "The Email property failed to store the string correctly.");
            Assert.AreEqual(testHash, admin.PasswordHash, "The PasswordHash integrity check failed.");
        }

        /// Testing how the model handles 'null' for the Email field.
        /// This is important for cases where an admin account might be partially created or cleared in the database.
      
        [TestMethod]
        public void AdminModel_NullEmail_Test()
        {
            // Arrange & Act: Setting up an admin with no email address
            var admin = new Admin { Email = null };

            // Assert: Confirming that the system accepts 'null' without throwing an error
            Assert.IsNull(admin.Email, "The model should allow a null Email value for flexibility.");
        }
    }
}