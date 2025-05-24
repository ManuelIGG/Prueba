FROM openjdk:17
COPY "./target/EquiposFutbol.jar.jar" "app.jar"
EXPOSE 8105
ENTRYPOINT ["java", "-jar", "app.jar"]