# Week 7 - Challenge WeekEnd - RepoBack

## Robots

Tendrás que crear un **frontend** en React (con Redux) que permita al usuario gestionar un listado con sus robots. El usuario debe poder listar, crear, modificar y borrar robots. Cada robot debe mostrar un nombre, una imagen (URL de internet) y unas características:

-   Velocidad (0-10)
-   Resistencia (0-10)
-   Fecha de creación

Tendrás que crear una base de datos MongoDB para almacenar los robots, en Atlas.

Tendrás que crear una API REST con Express, con los siguientes endpoints:

[GET] /robots -> devuelve un array con todos los robots de la BD

[GET] /robots/:idRobot -> devuelve un robot de la BD por id

[POST*] /robots/create -> recibe un robot (sin id), lo crea en la BD y devuelve el robot recién creado

[PATCH*] /robots/update -> recibe un robot, modifica en la BD el robot con la misma id que el recibido, y devuelve el robot modificado

[DELETE*] /robots/delete/:idRobot -> elimina de la BD un robot por id y devuelve un objeto con la id

Recuerda que cada response debe ir con un código de status adecuado y que todos los body de las responses tienen que ser **objetos** en JSON.

Sobra decirlo: **TESTEAMOS** todo y lo mostramos en **SonarCloud**.

# Challenge 1 Week 8 - Ampliar Challenge Robots

## TESTEAR

-   BACK: Añadir Modelo Usuarios y su endpoint (REGISTER/LOGIN)
    -   En el login enviar el TOKEN al usuario

## TESTEAR

-   BACK:
    A. Modificar los endpoints de Robots, excepto el getAll, para que solo sean accesibles a usuarios logueados
    B. Modificar todos los endpoints de Robots, para que solo sean accesibles a usuarios logueados

## TESTEAR

-   BACK: Completar los CRUDS de robots

## TESTEAR

-   FRONT: Añadir formulario de crear/registrar nuevos usuarios
-   FRONT: Añadir formulario de login para los usuarios
-   FRONT: Añadir el header de Authorization para poder acceder a los endpoints de robots protegidos en el backend cuando el usuario ha hecho login
