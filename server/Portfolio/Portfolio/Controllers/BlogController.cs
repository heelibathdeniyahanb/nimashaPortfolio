using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Data;
using Portfolio.Dtos;
using Portfolio.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System;
using System.Reflection.Metadata;

namespace Portfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public BlogController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetBlogs()
        {
            var blogs = await _context.Blogs.Include(b => b.BlogAttachments).ToListAsync();
            var blogDtos = blogs.Select(blog => new BlogDto
            {
                Id = blog.Id,
                Name = blog.Name,
                Description = blog.Description,
                Categories = blog.Categories,
                DateAdded = blog.DateAdded,
                DateModified = blog.DateModified,
                Attachments = blog.BlogAttachments.Select(ba => new BlogAttachmentDto
                {
                    Id = ba.Id,
                    FileName = ba.FileName,
                    Content = ba.Content,
                }).ToList()
            }).ToList();

            return Ok(blogDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetBlog(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.BlogAttachments)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return NotFound();
            }

            var blogDto = new BlogDto
            {
                Id = blog.Id,
                Name = blog.Name,
                Description = blog.Description,
                Categories = blog.Categories,
                DateAdded = blog.DateAdded,
                DateModified = blog.DateModified,
                Attachments = blog.BlogAttachments.Select(ba => new BlogAttachmentDto
                {
                    Id = ba.Id,
                    FileName = ba.FileName,
                    Content = ba.Content,
                }).ToList()
            };

            return Ok(blogDto);
        }

        [HttpGet("attachments/{attachmentId}")]
        public async Task<IActionResult> GetAttachment(int attachmentId)
        {
            var attachment = await _context.BlogAttachment.FindAsync(attachmentId);

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

        [HttpPost]
        public async Task<ActionResult<Blogs>> AddBlog([FromForm] BlogPostDto blogDto)
        {
            var blog = new Blogs
            {
                Name = blogDto.Name,
                Description = blogDto.Description,
                Categories = blogDto.Categories,
                DateAdded = DateTime.Now,
                DateModified = DateTime.Now
            };

            if (blogDto.Files != null && blogDto.Files.Count > 0)
            {
                foreach (var file in blogDto.Files)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        var blogAttachment = new BlogAttachment
                        {
                            FileName = file.FileName,
                            Content = memoryStream.ToArray(),
                        };
                        blog.BlogAttachments.Add(blogAttachment);
                    }
                }
            }

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditBlog(int id, [FromForm] BlogUpdateDto blogDto)
        {
            if (id != blogDto.Id)
            {
                return BadRequest();
            }

            var blog = await _context.Blogs
                .Include(b => b.BlogAttachments)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return NotFound();
            }

            blog.Name = blogDto.Name;
            blog.Description = blogDto.Description;
            blog.Categories = blogDto.Categories;
            blog.DateModified = DateTime.Now;

            if (blogDto.Files != null && blogDto.Files.Count > 0)
            {
                // Remove existing attachments if needed
                foreach (var attachment in blog.BlogAttachments.ToList())
                {
                    _context.BlogAttachment.Remove(attachment);
                }

                blog.BlogAttachments.Clear();

                // Add new attachments
                foreach (var file in blogDto.Files)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);
                        var blogAttachment = new BlogAttachment
                        {
                            FileName = file.FileName,
                            Content = memoryStream.ToArray(),
                        };
                        blog.BlogAttachments.Add(blogAttachment);
                    }
                }
            }

            _context.Entry(blog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogExists(id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.Id == id);
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

        public class BlogDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Categories { get; set; }
            public DateTime DateAdded { get; set; }
            public DateTime DateModified { get; set; }
            public List<BlogAttachmentDto> Attachments { get; set; } = new List<BlogAttachmentDto>();
        }

        public class BlogAttachmentDto
        {
            public int Id { get; set; }
            public string FileName { get; set; }
            public byte[] Content { get; set; }
        }

        public class BlogPostDto
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string Categories { get; set; }
            public List<IFormFile> Files { get; set; }
        }

        public class BlogUpdateDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string Categories { get; set; }
            public List<IFormFile> Files { get; set; }
        }
    }
}
