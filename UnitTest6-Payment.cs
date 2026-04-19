using Microsoft.VisualStudio.TestTools.UnitTesting;
using AquaSphere.Models;

namespace AquaSphere.UnitTests
{
    [TestClass]
    public class PaymentTests
    {
        // Test 13:Payment core data intgrity 
        [TestMethod]
        public void PaymentModel_PropertyValidation_Test()
        {
        //verifying that the Payment model accurately stores transaction IDs, member links, and financial amounts.
            var payment = new Payment();
            int testId = 500;
            int testMemberId = 10;
            double testAmount = 45.99;
            string testDate = "2026-04-09";

            payment.Id = testId;
            payment.MemberId = testMemberId;
            payment.Amount = testAmount;
            payment.PaymentDate = testDate;

            Assert.AreEqual(testId, payment.Id, "The Payment ID was not stored correctly.");
            Assert.AreEqual(testMemberId, payment.MemberId, "The MemberId link failed the integrity check.");
            Assert.AreEqual(testAmount, payment.Amount, "The Amount property failed to store the double value correctly.");
            Assert.AreEqual(testDate, payment.PaymentDate, "The PaymentDate string does not match the input.");
        }

        // Test 14: payment currency preicion check
        [TestMethod]
        public void PaymentModel_LargeAmount_Test()
        {
            // checking if the double type handles larger financial values correctly to prevent rounding errors in the app
            var payment = new Payment { Amount = 1250.75 };

            Assert.AreEqual(1250.75, payment.Amount, "The model failed to maintain precision for a large currency amount.");
        }
    }
}
