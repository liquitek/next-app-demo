'use server';

const Process = {
    counter:0,
    reqs:0,
    exec:async function (res) {++this.counter;await res;--this.counter;return res},
};


export async function scrapper(input,base) {
    if (!(input && base)) return false;
    const MAX_OUTBOUND_REQS = 20;
    return await Process.exec(doAction({alias:input,baseUrl:`https://${base}.bandcamp.com`}));
    
    async function doAction(input) {

        class Hyperlink {
            constructor(url,info) {
            this.url = url
            this.info = info || null;
            }
            async fetchData(){
            if (Process.reqs>MAX_OUTBOUND_REQS) {
                while (true){
                if (Process.reqs<MAX_OUTBOUND_REQS) break;
                await new Promise(resolve => setTimeout(resolve, 30));
                }
            }
            Process.reqs++;
            process.stdout.write(`Process.reqs: ${Process.reqs}\r`);
            var counter=0;
            var res;
            while (true) {
                counter++;
                console.log(this.url+"\n");
                res = await fetch(this.url);
                
                if (res.ok || counter==3) break;
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            if (!res.ok) {
                console.log(`Failed to fetch from: ${this.url}`);
            }
            
            return await res.text().then(Process.reqs--)
            }
            toString() {
            return this.url
            }
        
        }

        var trackLinks =[];
        var playerLinks=[];
        var wrongLinks = [];
        var {alias, baseUrl} = input;
        var links = Array.from(/<li\s+data-item.*?>.*?<a.*?href="([^"]*)".*?>.*?<span class="artist-override">(.*?)<\/span>.*?<\/li>/gmsd[Symbol.matchAll](await new Hyperlink(baseUrl+"/music").fetchData()),(m) => new Hyperlink(((m[1].indexOf("https://")>=0)?'': baseUrl)+m[1].substring(0,(m[1].indexOf("?")>0)?m[1].indexOf("?"):undefined),m[2].trim()));
        console.log(`Process.counter: ${Process.counter}`);
        console.log(alias);

        

        links.forEach(link => {
            if (link.toString().includes("track/") && link.info.includes(alias))
            wrongLinks.push(link);
        })

        await makeRequests(links,trackLinks,getTrackLinks);
        await makeRequests(wrongLinks,playerLinks,getPlayerLinks);
        await makeRequests(trackLinks,playerLinks,getPlayerLinks);
        console.log(links);

        wrongLinks=[];
        links=[];
        trackLinks=[];
        console.log(`Done processing ${alias}`);
        return playerLinks;

        async function getTrackLinks (hyperlink,filter) {
            var html = await hyperlink.fetchData();
            var testSingle = new RegExp(`<meta name="title" content="[^"]*?by ${filter}(?!\s*,)`,"gmsd");
            if (html.match(testSingle)) filter='';
            var regExp = new RegExp(`<a href="([^"]*)"><span class="track-title">[^<^>]*?${filter}[^<^>]*?<\/span><\/a>`, "gmsd");
            return Array.from(regExp[Symbol.matchAll](html),(m) => new Hyperlink(m[1].indexOf("https://")>=0 ? m[1]:baseUrl+m[1]));
        }

        async function getPlayerLinks (hyperlink) {
            var regExp = new RegExp(`<meta property="twitter:player" content="([^"]*?)">`, "gmsd");
            return Array.from(regExp[Symbol.matchAll](await hyperlink.fetchData()),(m) => m[1]);
        }
        
        async function makeRequests(arr1,arr2,fn) {
            var promises=[];
            for (var i in arr1) {
            
            promises.push(fn(arr1[i],alias).then(r=>{if (r.length>0) arr2.push(...r)}))
            /*
            if (promises.length==50) {
                await Promise.all(promises);
                promises=[];
            }
            */
            }
            await Promise.all(promises);
            promises=[];
            return true;
        }
    }
};

