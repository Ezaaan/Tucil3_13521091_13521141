function Path(parentVal, currentVal, valueVal){
    return {parent: parentVal, current: currentVal, value:valueVal};
    // constructor(parent, current, value){
    //     // Type Path
    //     this.parent = parent;
        
    //     this.current = current;
    //     this.value = value;
    // }
}

class PrioQueue{
    constructor(){
        //Type Path
        this.elements = [];
        
        this.size = 0;
    }

    getHead(){
        return this.elements[0];
    }

    enqueue(element){
        if(this.size == 0){
            this.elements.push(element);
        }else{
            var pos = -1;
            for(let i = 0; i < this.size; i++){
                if(this.elements[i].value > element.value){
                    pos = i;
                    break;
                }
            }

            // If pos is at the end or not
            if(pos == -1){
                this.elements.push(element);
            }else{
                for(let i = this.size; i > pos; i--){
                    if(i == this.size){
                        this.elements.push(this.elements[this.size - 1]);
                    }else{
                        this.elements[i] = this.elements[i - 1];
                    }
                }
            }
            
            // Insert element at pos
            this.elements[pos] = element;
        }
        this.size++;
    }

    dequeue(){
        console.log("DEQUEUE DEBUG#1: " + this.elements[0]);
        var element = this.elements[0];
        
        for(let i = 0; i < this.size - 1; i++){
            this.elements[i] = this.elements[i + 1];
        }

        this.elements.pop();

        //console.log("DEQUEUE DEBUG: " + element.current);

        return element;
    }
}

function createGraphMap(graph){
    var graphMap = {};
    for(let i = 0; i < graph.length; i++){
        var current = graph[i];
        // First
        if(graphMap[current[0]] == null){
            graphMap[current[0]] = {};
        }
        if(graphMap[current[1]] == null){
            graphMap[current[1]] = {};
        }
        graphMap[current[0]][current[1]] = current[2];
        graphMap[current[1]][current[0]] = current[2];
    }
    return graphMap;
}



function search(graphMap, start, end, method){
    var queue = new PrioQueue();
    var temp = new Path(null, start, 0);
    console.log("Value: " + temp.value);
    queue.enqueue(temp);

    var flag = false;
    var history = [];

    while(queue.size > 0){
        var active = queue.dequeue();
        console.log(active);
        history.push(active.current);

        if(active.current == end){
            return active;
        }else{
            var nextNodes = possibleNodes(graphMap, active);
            for(let i = 0; i < nextNodes.length; i++){
                if(!isExist(history, active)){
                    queue.enqueue(new Path(active, nextNodes[i].current, nextNodes[i].value + active.value));
                }
            }
        }
    }
}

function possibleNodes(graphMap, currentNode){
    var possibilities = [];
    var node = graphMap[currentNode];
    for(let i in node){
        possibilities.push({currentNode: i, value: node[i]})
    }
    return possibilities;
}

function writeResult(resultPath){
    if(resultPath.parent != null){
        writeResult(resultPath.parent);
        console.log(" => " + resultPath.current + "(" + resultPath.value + ")");
    }else{
        console.log(resultPath.current + "(" + resultPath.value + ")");
    }
}

function isExist(history, node){
    for(let i = 0; i < history.length; i++){
        if(history[i] == node) return true;
    }
    return false;
}

var testGraph = [
    ["oradea"         , "zerind"         , 71],
    ["oradea"         , "sibiu"          , 151],
    ["zerind"         , "arad"           , 75],
    ["arad"           , "sibiu"          , 140],
    ["arad"           , "timisoara"      , 118],
    ["timisoara"      , "lugoj"          , 111],
    ["lugoj"          , "mehadia"        , 70],
    ["mehadia"        , "drobeta"        , 75],
    ["drobeta"        , "craiova"        , 120],
    ["craiova"        , "pitesti"        , 138],
    ["craiova"        , "rimnicu vilcea" , 146],
    ["sibiu"          , "rimnicu vilcea" , 80],
    ["rimnicu vilcea" , "pitesti"        , 97],
    ["sibiu"          , "fagaras"        , 99],
    ["fagaras"        , "bucharest"      , 211],
    ["pitesti"        , "bucharest"      , 101],
    ["bucharest"      , "giurgiu"        , 90],
    ["bucharest"      , "urziceni"       , 85],
    ["urziceni"       , "hirsova"        , 98],
    ["hirsova"        , "eforie"         , 86],
    ["urziceni"       , "vaslui"         , 142],
    ["vaslui"         , "iasi"           , 92],
    ["iasi"           , "neamt"          , 87]
];

writeResult(search(createGraphMap(testGraph), "arad", "bucharest", "UCS"));