FROM maven:3.9.5-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
COPY srm-parent/pom.xml srm-parent/
COPY srm-common/pom.xml srm-common/
COPY srm-types-base/pom.xml srm-types-base/
COPY srm-gateway/pom.xml srm-gateway/
COPY srm-supplier/pom.xml srm-supplier/
COPY srm-material/pom.xml srm-material/
COPY srm-pricing/pom.xml srm-pricing/
COPY srm-contract/pom.xml srm-contract/
COPY srm-purchase/pom.xml srm-purchase/
COPY srm-organization/pom.xml srm-organization/
COPY srm-workflow/pom.xml srm-workflow/
COPY srm-notification/pom.xml srm-notification/

RUN mvn dependency:go-offline -B

COPY srm-common/src srm-common/src
COPY srm-types-base/src srm-types-base/src
COPY srm-gateway/src srm-gateway/src
COPY srm-supplier/src srm-supplier/src
COPY srm-material/src srm-material/src
COPY srm-pricing/src srm-pricing/src
COPY srm-contract/src srm-contract/src
COPY srm-purchase/src srm-purchase/src
COPY srm-organization/src srm-organization/src
COPY srm-workflow/src srm-workflow/src
COPY srm-notification/src srm-notification/src

RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/srm-gateway/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
