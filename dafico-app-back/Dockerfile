# Paso 1: Usamos una imagen ligera de Java 17
FROM eclipse-temurin:17-jdk-alpine

# Paso 2: Creamos un directorio para la app
WORKDIR /app

# Paso 3: Copiamos el archivo JAR generado por Maven
# Asegúrate de que el nombre coincida con el que tienes en /target
COPY target/*.jar dafico-0.0.1-SNAPSHOT.jar

# Paso 4: Exponemos el puerto de Spring Boot
EXPOSE 8080

# Paso 5: Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "dafico-0.0.1-SNAPSHOT.jar"]