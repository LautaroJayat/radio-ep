var i = 6;
document.getElementById("gimmi").addEventListener("click", () => {
    fetch(`/all/news?page=${i}`)
        .then((response) => {
            return response.json();
        })
        .then(res => {
            res.news.forEach(e => {
                let article = document.createElement('div');
                article.classList.add('article');
                let img_container = document.createElement('div');
                img_container.classList.add('img-container');
                let link = document.createElement('a');
                link.href = `/contents/news/${e.url}`;
                let image = document.createElement('img');
                image.src = e.thumbnail;
                let info = document.createElement('div');
                info.classList.add('info');
                let link2 = document.createElement('a');
                link2.href = `contents/news/${e.url}`;
                let title = document.createElement('h2');
                title.classList.add('article-title');
                title.appendChild(document.createTextNode(e.title));
                let date = document.createElement('span');
                date.classList.add('date');
                date.appendChild(document.createTextNode(e.date));
                link2.appendChild(title);
                let container = document.createElement('div');
                container.appendChild(date);
                container.appendChild(link2);
                info.appendChild(container);
                let author = document.createElement('div');
                author.classList.add('author');
                let author_container = document.createElement('div');
                author_container.classList.add('author_container');
                let author_img = document.createElement('img');
                author_img.src = e.author_thumbnail;
                author_container.appendChild(author_img);
                author.appendChild(author_container);
                let author_name = document.createElement('span');
                author_name.appendChild(document.createTextNode('Por '));
                let StrongestNameInTheHistory = document.createElement('strong');
                StrongestNameInTheHistory.appendChild(document.createTextNode(e.author));
                author_name.appendChild(StrongestNameInTheHistory);
                author.appendChild(author_name);
                info.appendChild(author);
                link.appendChild(image);
                img_container.appendChild(link);
                article.appendChild(img_container);
                article.appendChild(info);
                let grid = document.getElementById("grid-container");
                grid.appendChild(article);
            })

        }
        ).catch((err) => {
            let par = document.createElement('h3');
            par.appendChild(document.createTextNode("Me parece que no tenemos más tenemos más noticias. Te recomendamos recorrer el resto de la página, visitar nuestras redes o sumarte en alguna de nuestras épicas fiestas."));
            let grid = document.getElementById("grid-container");
            par.classList.add('font-crimson');
            grid.appendChild(par);
        });
    i = i + 3;
    console.log(i)
});
