using System.Globalization;
using Newtonsoft.Json;

namespace JobLink_Backend.Utilities.CustomDateTimeConverter;

public class CustomDateTimeConverter : JsonConverter<DateTime?>
{
    private const string DateFormat = "yyyy-MM-dd HH:mm:ss";

    public override void WriteJson(JsonWriter writer, DateTime? value, JsonSerializer serializer)
    {
        writer.WriteValue(value?.ToString(DateFormat));
    }

    public override DateTime? ReadJson(JsonReader reader, Type objectType, DateTime? existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.String)
        {
            var dateAsString = reader.Value.ToString();
            if (DateTime.TryParseExact(dateAsString, DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
            {
                return date;
            }
        }
        return null;
    }
}