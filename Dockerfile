FROM openjdk:17
COPY "./target/com.vdg-1.jar" "app.jar"
EXPOSE 8113 
ENTRYPOINT [ "java", "-jar", "app.jar" ]