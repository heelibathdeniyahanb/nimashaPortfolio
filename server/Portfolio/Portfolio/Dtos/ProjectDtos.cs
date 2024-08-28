public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Categories { get; set; }
    public List<string> Technologies { get; set; }
    public DateTime DateAdded { get; set; } = DateTime.Now; // Default to current time
    public DateTime DateModified { get; set; } = DateTime.Now;
    public List<ProjectAttachmentDto> Attachments { get; set; } = new List<ProjectAttachmentDto>();
    public bool IsTagged { get; set; } = false;
}

public class ProjectAttachmentDto
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public byte[] Content { get; set; }
}
