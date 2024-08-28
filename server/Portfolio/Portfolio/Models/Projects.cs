using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Eventing.Reader;
using System.Text.Json.Serialization;

namespace Portfolio.Models
{
    public class Projects
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.Now;
        public DateTime DateModified { get; set; } = DateTime.Now;
        public List<string> Technologies { get; set; } = new List<string>();
       
        [JsonIgnore]
        public List<ProjectAttachment> ProjectAttachments { get; set; } = new List<ProjectAttachment>();
        public bool IsTagged { get; set; } = false;

    }
    public class ProjectAttachment
    {
        [Key]
        public int Id { get; set; }

        public string FileName { get; set; }
        public byte[] Content { get; set; }

        public int ProjectId { get; set; }
        public Projects Projects { get; set; }
    }
}
