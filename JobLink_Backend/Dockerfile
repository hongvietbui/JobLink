# Sử dụng image .NET SDK để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Sao chép và restore các packages
COPY *.csproj ./
RUN dotnet restore

# Sao chép toàn bộ mã nguồn và build
COPY . ./
RUN dotnet publish -c Release -o out

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Cấu hình biến môi trường nếu cần
ENV ASPNETCORE_URLS=http://*:8080

# Mở cổng 8080
EXPOSE 8080

# Chạy migration trước khi khởi động ứng dụng
ENTRYPOINT ["sh", "-c", "dotnet JobLink_Backend.dll && dotnet ef database update --no-build"]