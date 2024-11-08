using System.ComponentModel;

namespace JobLink_Backend.Entities;

public enum SupportCategory
{
    [Description("User Interface/User Experience (UI/UX) Error")]
    UIUXError,

    [Description("Functional Error")]
    FunctionalError,

    [Description("Security Issue")]
    SecurityIssue,

    [Description("Performance Issue")]
    PerformanceIssue,

    [Description("Job Error")]
    JobError,
    
    [Description("Payment Error")]
    PaymentError,

    [Description("Improvement Suggestions or Feedback")]
    ImprovementSuggestion,

    [Description("Other Errors")]
    Other
}
