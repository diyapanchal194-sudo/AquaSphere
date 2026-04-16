namespace AquaSphere.Models
{
    public class Payment
    {
        public int Id { get; set; }
        
        // This links the payment to a specific member
        public int MemberId { get; set; } 
        
        public double Amount { get; set; }
        
        // SQLite stores dates as Strings (TEXT)
        public string PaymentDate { get; set; } 
    }
}
