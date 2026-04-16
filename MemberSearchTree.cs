namespace AquaSphere
{
    public class MemberSearchTree
    {
        private MemberNode? _root;

        public void Insert(Member member)
        {
            _root = InsertRecursive(_root, member);
        }

        private MemberNode InsertRecursive(MemberNode? node, Member member)
        {
            if (node == null)
                return new MemberNode(member);

            int comparison = string.Compare(
                member.Email,
                node.Data.Email,
                StringComparison.OrdinalIgnoreCase);

            if (comparison < 0)
                node.Left = InsertRecursive(node.Left, member);
            else if (comparison > 0)
                node.Right = InsertRecursive(node.Right, member);

            return node;
        }

        public Member? SearchByEmail(string email)
        {
            return SearchRecursive(_root, email);
        }

        private Member? SearchRecursive(MemberNode? node, string email)
        {
            if (node == null)
                return null;

            int comparison = string.Compare(
                email,
                node.Data.Email,
                StringComparison.OrdinalIgnoreCase);

            if (comparison == 0)
                return node.Data;

            if (comparison < 0)
                return SearchRecursive(node.Left, email);

            return SearchRecursive(node.Right, email);
        }
    }
}