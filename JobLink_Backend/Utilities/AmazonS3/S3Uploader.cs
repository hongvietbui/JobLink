using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

namespace JobLink_Backend.Utilities.AmazonS3;

public class S3Uploader
{
    private readonly IConfiguration _configuration;
    private readonly string bucketName;
    private readonly string accessKey;
    private readonly string secretKey;
    private readonly RegionEndpoint region;
    private readonly IAmazonS3 _s3Client;
    
    public S3Uploader(IConfiguration configuration)
    {
        _configuration = configuration;
        bucketName = _configuration["AWS_S3:BucketName"];
        accessKey = _configuration["AWS_S3:AccessKey"];
        secretKey = _configuration["AWS_S3:SecretKey"];
        region = RegionEndpoint.GetBySystemName(_configuration["AWS_S3:Region"]);
        _s3Client = new AmazonS3Client(accessKey, secretKey, region);
    }
    
    public async Task<string> UploadFileAsync(IFormFile file)
    {
        try
        {
            var fileTransferUtility = new TransferUtility(_s3Client);
            
            string fileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(file.FileName)}";
            
            using (var stream = file.OpenReadStream())
            {
                var uploadRequest = new TransferUtilityUploadRequest
                {
                    BucketName = bucketName,
                    InputStream = stream,
                    Key = fileName,
                    CannedACL = S3CannedACL.PublicRead
                };

                await fileTransferUtility.UploadAsync(uploadRequest);
            }
            
            return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
        }
        catch (AmazonS3Exception e)
        {
            Console.WriteLine($"Error occurred: {e.Message}");
            throw;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error when uploading file: {e.Message}");
            throw;
        }
    }
}