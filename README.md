# BeeSmart

Aplikacija za praćenje stanja **pčelinjaka** koja pomaže pčelarima koji ne mogu u svakom trenutku da budu na pčelinjaku. Omogućava praćenje različitih statistika na pčelinjaku i u košnicama, kao što su temperatura, vlažnost vazduha, vazdušni pritisak...

# Mogućnosti
- Registracija korisnika
- Potpuna kontrola nad košnicama i pčelinjacima
- Praćenje metrika i za košnice i za pčelinjake
- Dodavanje novih košnica i pčelinjaka
- Izmena postojećih košnica i pčelinjaka
- Brisanje košnica i pčelinjaka

# Korišćene tehnologije i pokretanje aplikacije

Backend je pisan u Flask-u, Python web framework-u, dok je sistem za upravljanje bazom podataka PostGreSQL. Za frontend je korišćen React.

Nakon kloniranja projekta, potrebno je uraditi pokrenuti komandu `pip install -r requirements.txt`(u root folderu) koja instalira sve potrebe biblioteke za Flask. Nakon toga potrebno je pokrenuti `npm install`(u beeappReact folderu), što instalira sve potrebne module za React. 

Nakon uspešne instalacije svih biblioteka i modula, u Powershell-u ili Linux terminalu, potrebno je pokrenuti komandu `docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`, što pravi Docker container(Potrebno samo pri prvom pokretanju). Sledeći korak je pokretanje samog Docker container-a. Prvo je potrebno pronaći id container-a koji želimo da pokrenemo, što možemo uraditi pomoću naredbe `docker ps -a`, a container pokrećemo komandom `docker run <id_container-a>`.

Pokretanje backend-a se vrši pomoći komande `flask run`(u beeApp projektu), a frontend se pokreće komandom `npm run dev`(u beeappReact folderu) 

# Izgled aplikacije
<img src = "/slike_readme/image.png">
Landing page
<img src = "/slike_readme/2.png">
LogIn
<img src = "/slike_readme/3.png">
Apiary Dashboard
