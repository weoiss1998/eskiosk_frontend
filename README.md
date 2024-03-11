Generell wird empfohlen, diese Container nur in einer Linux Umgebung auszuführen.
Bei Windows kann es passieren, dass die Container nicht richtig starten!

In der .env Datei muss die REACT_APP_API_URL genauso wie im Backend gesetzt sein! Daran wird noch Port 8008 gehängt.

Auf der Ebene von dem src-Ordner folgende Befehle ausführen:
```sh
docker compose build
```

und danach:
```sh
docker compose up
```

Die Seite sollte nun unter localhost erreichbar sein.
Zu Beginn existiert ein Benutzer mit dem Konto admin:admin.
Bitte unbedingt das Passwort in den Einstellungen ändern!
Das Produkt-Form nimmt nur png-Dateien an. Die Anzahl der Pixel sollte nicht viel zu groß sein.

Als Basis diente: [https://github.com/testdrivenio/fastapi-docker-traefik](https://github.com/testdrivenio/fastapi-docker-traefik)