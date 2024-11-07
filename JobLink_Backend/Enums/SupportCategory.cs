using System.ComponentModel;

namespace JobLink_Backend.Entities;

public enum SupportCategory
{
    [Description("Lỗi giao diện người dùng (UI/UX)")]
    UIUXError,

    [Description("Lỗi chức năng")]
    FunctionalError,

    [Description("Lỗi về bảo mật")]
    SecurityIssue,

    [Description("Lỗi về hiệu suất")]
    PerformanceIssue,

    [Description("Lỗi job")]
    JobError,
    
    [Description("Lỗi thanh toán")]
    PaymentError,

    [Description("Đề xuất cải tiến hoặc góp ý")]
    ImprovementSuggestion,

    [Description("Lỗi khác")]
    Other
}