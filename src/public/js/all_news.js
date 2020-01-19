var i = 6;
document.getElementById("gimmi").addEventListener("click", () => {
    fetch(`/all/news?page=${i}`)
        .then((response) => {
            return response.json();
        })
        .then(res => {
            res.news.forEach(e => {
                let article = document.createElement('div');
                article.classList.add('article-big');
                let img_container = document.createElement('div');
                img_container.classList.add('img-container');
                let image = document.createElement('img');
                image.classList.add('cover');
                image.src = e.thumbnail;
                img_container.appendChild(image);
                let info = document.createElement('div');
                info.classList.add('info');
                let headline = document.createElement('span');
                headline.classList.add('headline');
                headline.appendChild(document.createTextNode(e.headline));
                let title = document.createElement('h4');
                title.classList.add('title');
                title.appendChild(document.createTextNode(e.title));
                let date = document.createElement('span');
                date.classList.add('date');
                date.appendChild(document.createTextNode(e.date));
                let author = document.createElement('span');
                author.classList.add('author');
                author.innerText = 'Por: ';
                let author_name = document.createElement('strong');
                author_name.classList.add('font-crimson');
                author_name.appendChild(document.createTextNode(e.author));
                author.appendChild(author_name);
                info.appendChild(headline);
                info.appendChild(title);
                info.appendChild(author)
                info.appendChild(date);
                article.appendChild(img_container);
                article.appendChild(info);
                let container = document.getElementById("container");
                let link = document.createElement('a');
                link.classList.add('cover');
                link.href = e.url;
                link.appendChild(img_container);
                link.appendChild(info);
                article.appendChild(link);
                container.appendChild(article);

            })

        }
        ).catch((err) => {
            let par = document.createElement('h3');
            par.appendChild(document.createTextNode("Me parece que no tenemos más tenemos más noticias. Te recomendamos recorrer el resto de la página, visitar nuestras redes o sumarte en alguna de nuestras épicas fiestas."));
            let container = document.getElementById("container");
            par.classList.add('font-crimson');
            container.appendChild(par);
        });
    i = i + 2;
    console.log(i)
});
