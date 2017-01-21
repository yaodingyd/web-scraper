### Intro

Run `npm install` and `npm start`.

Console will log all scraping info as well a result.txt will be generated.

The search deepth is called `limit` and works for both category numbers and entries in each category.


### Some thoughts
This is a raw implementation of web scraping of site www.revolico.com.

I'm using promise-based http calls to handle pipelining work. The current implementation is not pretty, but it can get job done.

I also think the basic methodology or implementation of all web scraping are quite similar, basically a http client plus a server-side html parser(whether it is PhantomJS or jsdom). The specific implementation of how to scraping the most valuable info for each site is the point here.   