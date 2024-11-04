using System.Reflection;

namespace JobLink_Backend.Utilities;

public class StringValueAttribute(string value) : Attribute
{
    public string Value { get; private set; } = value;
}

public static class EnumExtension
{
    public static string GetStringValue(this Enum value)
    {
        var type = value.GetType();
        var fieldInfo = type.GetField(value.ToString());
        var attributes = fieldInfo.GetCustomAttributes(typeof(StringValueAttribute), false) as StringValueAttribute[];
        
        return attributes?.Length > 0 ? attributes[0].Value : value.ToString();
    }
    
    public static TEnum? GetEnumValue<TEnum>(this string value)
    {
        var type = typeof(TEnum);
        //Check if the type is an enum
        if (!type.IsEnum)
        {
            throw new ArgumentException("TEnum must be an enumerated type");
        }
        //Access the field of the enum type
        foreach (var field in type.GetFields())
        {
            var attribute = (StringValueAttribute)field.GetCustomAttribute(typeof(StringValueAttribute))!;
            if (attribute != null && string.Equals(attribute.Value, value, System.StringComparison.OrdinalIgnoreCase))
            {
                return (TEnum)field.GetValue(null)!;
            }
        }

        return (TEnum)Enum.Parse(type, value);
    }
}