using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere;

namespace AquaSphere.Tests
{
    [TestClass]
    public class MemberNodeTests
    {
        // Test 3: checking if the Node actually holds the Member data.
        // updated this to FirstName because the Member.cs model doesn't use "Name".
        [TestMethod]
        public void Test3_MemberNode_DataStorage_Check()
        {
            // creating a dummy member for the tree root
            var m = new Member { FirstName = "amar", LastName = "singh", Email = "amar@singh.com" };
            
            // putting it in a node
            var node = new MemberNode(m);

            // The node should have the data and children should be null initially
            Assert.AreEqual("amar", node.Data.FirstName);
            Assert.IsNull(node.Left); 
            Assert.IsNull(node.Right);
            
            // double checking the last name too
            Assert.AreEqual("singh", node.Data.LastName);
        }

        /* Test 4: testing the Pointers. 
           in a BST, the Left and Right links are the most important part.
           if these don't work, the whole MemberSearchTree will fail.
        */
        [TestMethod]
        public void Test4_Linkage_Validation()
        {
            // Setup 3 nodes: A parent and two potential children
            var rootNode = new MemberNode(new Member { FirstName = "Boss" });
            var leftChild = new MemberNode(new Member { FirstName = "LeftSub" });
            var rightChild = new MemberNode(new Member { FirstName = "RightSub" });

            // ACT: manually linking them to see if the references hold
            rootNode.Left = leftChild;
            rootNode.Right = rightChild;

            // ASSERT: verifying the "Memory Bridge"
            Assert.IsNotNull(rootNode.Left, "Left link is broken!");
            Assert.AreEqual("LeftSub", rootNode.Left.Data.FirstName);
            
            Assert.IsNotNull(rootNode.Right, "Right link is broken!");
            Assert.AreEqual("RightSub", rootNode.Right.Data.FirstName);
            
            // Log: Structural Integrity confirmed. Pointers are stable.
        }
    }
}