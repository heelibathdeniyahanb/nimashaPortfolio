using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Models;
using Portfolio.Data;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System;

namespace Portfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public ProjectController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Project
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var projects = await _context.Projects.Include(p => p.ProjectAttachments).ToListAsync();
            var projectDtos = projects.Select(project => new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Categories = project.Categories,
                Technologies = project.Technologies,
                DateAdded = project.DateAdded,
                DateModified = project.DateModified,
                IsTagged = project.IsTagged,
                Attachments = project.ProjectAttachments.Select(pa => new ProjectAttachmentDto
                {
                    Id = pa.Id,
                    FileName = pa.FileName,
                    Content = pa.Content,
                    
                }).ToList()
            }).ToList();

            return Ok(projectDtos);
        }

        // GET: api/Project/attachments/5
        [HttpGet("attachments/{attachmentId}")]
        public async Task<IActionResult> GetAttachment(int attachmentId)
        {
            var attachment = await _context.ProjectAttachment.FindAsync(attachmentId);

            if (attachment == null)
            {
                return NotFound();
            }

            var contentType = GetContentType(attachment.FileName);
            var contentDisposition = new ContentDispositionHeaderValue("inline")
            {
                FileName = attachment.FileName
            };

            Response.Headers.Add("Content-Disposition", contentDisposition.ToString());

            return File(attachment.Content, contentType);
        }

        // GET: api/Project/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.ProjectAttachments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            var projectDto = new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Categories = project.Categories,
                Technologies = project.Technologies,
                IsTagged = project.IsTagged,
                DateAdded = project.DateAdded,
                DateModified = project.DateModified,
                Attachments = project.ProjectAttachments.Select(pa => new ProjectAttachmentDto
                {
                    Id = pa.Id,
                    FileName = pa.FileName,
                    Content = pa.Content,
                   
                }).ToList()
            };

            return Ok(projectDto);
        }

        // POST: api/Project
        [HttpPost]
        public async Task<ActionResult<Projects>> PostProject([FromForm] ProjectPostDto projectDto)
        {
            var project = new Projects
            {
                Name = projectDto.Name,
                Description = projectDto.Description,
                Categories = projectDto.Categories,
                Technologies = projectDto.Technologies,
                IsTagged= projectDto.IsTagged,
                DateAdded = DateTime.Now,
                DateModified = DateTime.Now
            };

            if (projectDto.Files != null && projectDto.Files.Count > 0)
            {
                foreach (var file in projectDto.Files)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        var projectAttachment = new ProjectAttachment
                        {
                            FileName = file.FileName,
                            Content = memoryStream.ToArray(),
                           
                        };
                        project.ProjectAttachments.Add(projectAttachment);
                    }
                }
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/Project/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, [FromForm] ProjectUpdateDto projectDto)
        {
            if (id != projectDto.Id)
            {
                return BadRequest();
            }

            var project = await _context.Projects
                .Include(p => p.ProjectAttachments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            project.Name = projectDto.Name;
            project.Description = projectDto.Description;
            project.Categories = projectDto.Categories;
            project.Technologies = projectDto.Technologies;
            project.IsTagged = projectDto.IsTagged;
            project.DateModified = DateTime.Now;

            if (projectDto.Files != null && projectDto.Files.Count > 0)
            {
                // Remove existing attachments if needed
                foreach (var attachment in project.ProjectAttachments.ToList())
                {
                    _context.ProjectAttachment.Remove(attachment);
                }

                project.ProjectAttachments.Clear();

                // Add new attachments
                foreach (var file in projectDto.Files)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        var projectAttachment = new ProjectAttachment
                        {
                            FileName = file.FileName,
                            Content = memoryStream.ToArray(),
                           
                        };
                        project.ProjectAttachments.Add(projectAttachment);
                    }
                }
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Project/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }

        private string GetContentType(string fileName)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return types.ContainsKey(ext) ? types[ext] : "application/octet-stream";
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                { ".txt", "text/plain" },
                { ".pdf", "application/pdf" },
                { ".doc", "application/vnd.ms-word" },
                { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
                { ".xls", "application/vnd.ms-excel" },
                { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
                { ".png", "image/png" },
                { ".jpg", "image/jpeg" },
                { ".jpeg", "image/jpeg" },
                { ".gif", "image/gif" },
                { ".csv", "text/csv" },
                { ".mp4", "video/mp4" }
            };
        }

        public class ProjectDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Categories { get; set; }
            public List<string> Technologies { get; set; } = new List<string>();
            public DateTime DateAdded { get; set; }
            public DateTime DateModified { get; set; }
            public List<ProjectAttachmentDto> Attachments { get; set; } = new List<ProjectAttachmentDto>();
            public bool IsTagged { get; set; }
        }

        public class ProjectAttachmentDto
        {
            public int Id { get; set; }
            public string FileName { get; set; }
            public byte[] Content { get; set; }
            public DateTime DateAdded { get; set; }
            public DateTime DateModified { get; set; }
        }

        public class ProjectPostDto
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string Categories { get; set; }
            public List<string> Technologies { get; set; } = new List<string>();
            public List<IFormFile> Files { get; set; }
            public bool IsTagged { get; set; }
        }

        public class ProjectUpdateDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Categories { get; set; }
            public List<string> Technologies { get; set; } = new List<string>();
            public List<IFormFile> Files { get; set; }
            public bool IsTagged { get; set; }
        }
    }
}
