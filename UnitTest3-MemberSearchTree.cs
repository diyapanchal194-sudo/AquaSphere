using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere;

namespace AquaSphere.Tests
{
    [TestClass]
    public class MemberSearchTreeTests
    {
        private MemberSearchTree _tree;

        [TestInitialize]
        public void Setup()
        {
            // to initialize a fresh tree before every test
            _tree = new MemberSearchTree();
        }

        // TEST 5: verifying the Binary Search Tree Recursive Insertion & Search
        [TestMethod]
        public void Test5_BST_Should_Correctly_Insert_And_Find_By_Email()
        {
            // Arrange: creates a small balanced set of data
            var rootMember = new Member { Email = "m@test.com", FirstName = "Middle" };
            var leftMember = new Member { Email = "a@test.com", FirstName = "Alpha" };
            var rightMember = new Member { Email = "z@test.com", FirstName = "Zebra" };

            // Act: insert into the tree
            _tree.Insert(rootMember);
            _tree.Insert(leftMember);
            _tree.Insert(rightMember);

            // Assert: search for the 'Left' and 'Right' branches
            var resultLeft = _tree.SearchByEmail("a@test.com");
            var resultRight = _tree.SearchByEmail("z@test.com");

            Assert.IsNotNull(resultLeft, "Failed to find the Left node.");
            Assert.AreEqual("Alpha", resultLeft.FirstName);

            Assert.IsNotNull(resultRight, "Failed to find the Right node.");
            Assert.AreEqual("Zebra", resultRight.FirstName);
        }

        // Test 6: verifying Case Insensitivity in Search
        [TestMethod]
        public void Test6_Search_Should_Be_Case_Insensitive()
        {
            // Arrange
            var member = new Member { Email = "User@AquaSphere.com", FirstName = "Test" };
            _tree.Insert(member);

            // Act: search using lowercase
            var result = _tree.SearchByEmail("user@aquasphere.com");

            // Assert
            Assert.IsNotNull(result, "Search failed to handle case-insensitivity.");
            Assert.AreEqual("User@AquaSphere.com", result.Email);
        }

        // Test 7: verifying Edge Case - Searching for non-existent member
        [TestMethod]
        public void Test7_Search_NonExistent_Should_Return_Null()
        {
            // Arrange
            _tree.Insert(new Member { Email = "real@test.com" });

            // Act
            var result = _tree.SearchByEmail("fake@test.com");

            // Assert: to confirm the recursive search terminates safely
            Assert.IsNull(result, "Search should return null for emails not in the tree.");
        }
    }
}