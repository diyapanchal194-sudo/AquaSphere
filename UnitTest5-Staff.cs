using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere.Models;

namespace AquaSphere.UnitTests
{
    [TestClass]
    public class StaffTests
    {
        // Test 11:staff core data validation
        [TestMethod]
        public void StaffModel_PropertyValidation_Test()
        {
            // testing if the Staff model correctly handles employee IDs, full names, and dashboard login credentials.
            var staff = new Staff();
            int testId = 101;
            string testName = "John Doe";
            string testEmail = "j.doe@aquasphere.com";
            string testHash = "argon2_secret_hash_98765";

            staff.Id = testId;
            staff.FullName = testName;
            staff.Email = testEmail;
            staff.PasswordHash = testHash;

            Assert.AreEqual(testId, staff.Id, "The Staff ID was not stored correctly.");
            Assert.AreEqual(testName, staff.FullName, "The FullName property failed the integrity check.");
            Assert.AreEqual(testEmail, staff.Email, "The Staff Email does not match the input.");
            Assert.AreEqual(testHash, staff.PasswordHash, "The PasswordHash was not retrieved correctly.");
        }

        // Test 12: staff complex name handling
        [TestMethod]
        public void StaffModel_LongName_Test()
        {
            // verifying that the FullName property can store long or hyphenated names without data loss.
            var staff = new Staff { FullName = "Christopher-James Alexander-Montgomery" };

            Assert.AreEqual("Christopher-James Alexander-Montgomery", staff.FullName);
        }
    }
}
