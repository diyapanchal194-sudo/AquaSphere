namespace AquaSphere
{
    public class MemberNode
    {
        public Member Data { get; set; }
        public MemberNode? Left { get; set; }
        public MemberNode? Right { get; set; }

        public MemberNode(Member member)
        {
            Data = member;
        }
    }
}