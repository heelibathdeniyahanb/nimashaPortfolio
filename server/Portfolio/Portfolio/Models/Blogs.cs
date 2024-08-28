using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Portfolio.Models
{
    public class Blogs
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.Now;
        public DateTime DateModified { get; set; } = DateTime.Now;
        [JsonIgnore]
        public List<BlogAttachment> BlogAttachments { get; set; } = new List<BlogAttachment>();
    }

    public class BlogAttachment
    {
        [Key]
        public int Id { get; set; }

        public string FileName { get; set; }
        public byte[] Content { get; set; }

        public int BlogId { get; set; }
        public Blogs Blogs { get; set; }
    }
}

