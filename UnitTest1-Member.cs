using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere;

namespace AquaSphere.Tests {
    [TestClass]
    public class MemberTests {

        // TEST 1: Property Integrity (Happy Path)
        // I ran this test to ensure that when a user types their name/email, the backend 
        // saves it exactly as typed without corrupting the data
        [TestMethod]
        public void Test1_Member_DataStorage_ShouldMatchInput() {
            // Arrange
            var member = new Member { 
                FirstName = "amar", 
                Email = "amar@mdx.ac.uk" 
            };

            // Act & assert
            Assert.AreEqual("amar", member.FirstName, "The FirstName was not stored correctly.");
            Assert.AreEqual("amar@mdx.ac.uk", member.Email, "The Email was not stored correctly.");
        }

        // TEST 2: Null-Safety (Edge Case)
        // I ran this test so if a user leaves a field blank, we want to ensure the system 
        // uses an empty string ("") instead of 'null'. 'Null' causes 
        // the whole website to crash with a "NullReferenceException."
        [TestMethod]
        public void Test2_Member_Constructor_ShouldPreventNulls() {
            // Arrange
            var member = new Member();

            // Act & assert
            Assert.IsNotNull(member.FirstName, "The system failed to prevent a NULL value.");
            Assert.AreEqual("", member.FirstName, "The default value should be an empty string.");
        }

        // TEST 3: Identity Verification (Primary Key)
        // I ran this test so every member needs a unique ID number for the database. 
        // I tested this to ensure the 'Id' property is functioning as a valid integer.
        [TestMethod]
        public void Test3_Member_Id_ShouldStoreInteger() {
            // Arrange
            var member = new Member { Id = 101 };

            // Act & assert
            Assert.AreEqual(101, member.Id, "The Member ID was not stored or retrieved correctly.");
        }
    }
}
