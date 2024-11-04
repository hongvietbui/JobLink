namespace JobLink_Backend.Utilities.Pagination;

public class Pagination<T> where T : class
{
    public int TotalItems { get; set; }
    
    public int PageSize { get; set; }

    public int TotalPages
    {
        get
        {
            var temp = TotalItems / PageSize;
            return TotalItems % PageSize == 0 ? temp : temp + 1;
        }
    }
    
    public int PageIndex { get; set; }
    
    //page number start to 1
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
    public ICollection<T>? Items { get; set; } = new List<T>();
}