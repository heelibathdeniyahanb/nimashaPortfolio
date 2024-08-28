namespace Portfolio.Dtos
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateModified { get; set; }
        public List<BlogAttachmentDto> BlogAttachments { get; set; } = new List<BlogAttachmentDto>();
    }

    public class BlogAttachmentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public byte[] Content { get; set; }
    }

}
