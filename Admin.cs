namespace AquaSphere.Models
{
    public class Admin
    {
        public int Id { get; set; } // Primary Key
        public string Email { get; set; }
        public string PasswordHash { get; set; } // Never store plain passwords!
    }
}
