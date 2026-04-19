namespace AquaSphere.Models
{
    public class Payment
    {
        public int Id { get; set; }

        // Links payment to a member
        public int MemberId { get; set; }

        // Selected subscription plan
        public string PlanName { get; set; } = string.Empty;

        // Example: Monthly / Quarterly / Annual
        public string BillingPeriod { get; set; } = string.Empty;

        // Total amount paid
        public double Amount { get; set; }

        // Example: Card / Apple Pay
        public string PaymentMethod { get; set; } = string.Empty;

        // Example: Paid / Pending / Failed
        public string PaymentStatus { get; set; } = string.Empty;

        // SQLite stores dates as TEXT
        public string PaymentDate { get; set; } = string.Empty;
    }
}