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

result("arad", "bucharest", testGraph, createGraphMap, "UCS");

function createPath(parent, current, value) {
    return {
        parent : parent,
        current: current,
        value: value
    };
};

class Path{
    //return {parent: parentVal, current: currentVal, value:valueVal};
    constructor(parent, current, value){
        // Type Path
        this.parent = parent;
        
        this.current = current;
        this.value = value;
    }
}

function isExist(history, node){
    for(let i = 0; i < history.length; i++){
        if(history[i] == node) return true;
    }
    return false;
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

function compute(start, end, graphMap, func, method){
    function writeResult(resultPath){
        if(resultPath.parent != null){
            writeResult(resultPath.parent);
            console.log(" => " + resultPath.current + "(" + resultPath.value + ")");
        }else{
            console.log(resultPath.current + "(" + resultPath.value + ")");
        }
    }

    writeResult(func(graphMap, start, end, method));
}

function result(start, end, graph, func, method){

    function search(graphMap, start, end, method){
        function dequeue(array){
            var element = array[0];
                
            for(let i = 0; i < array.length - 1; i++){
                array[i] = array[i + 1];
            }
            array.pop();
        
            return element;
        }
        
        function enqueue(array, element){
            if(array.length == 0){
                array.push(element);
            }else{
                var pos = -1;
                for(let i = 0; i < array.length; i++){
                    if(method == "UCS" && array[i].value > element.value){
                        pos = i;
                        break;
                    }
                    // Diganti euclidean
                    else if(method == "A" && array[i].value > element.value){
                        pos = i;
                        break;
                    }
                }
        
                // If pos is at the end or not
                if(pos == -1){
                    array.push(element);
                }else{
                    for(let i = array.length; i > pos; i--){
                        if(i == array.length){
                            array.push(array[array.length - 1]);
                        }else{
                            array[i] = array[i - 1];
                        }
                    }
                }
                
                // Insert element at pos
                array[pos] = element;
            }
        }

        function possibleNodes(graphMap, currentNode){
            var possibilities = [];
            var node = graphMap[currentNode];
            for(var i in node){
                possibilities.push({current: i, value: node[i]});
            }
            return possibilities;
        }


        var queue = [];
        //enqueue(queue, createPath(null, start, 0))
        queue.push(createPath(null, start, 0));
        var head = 0;
        //enqueue(queue, createPath(null, start, 0));
    
        var history = [];
    
        while(queue.length - head != 0){
            var active = queue[head];
            head++;
            // console.log("Current active: ");
            // console.log(active);
            history.push(active.current);
    
            if(active.current == end){
                //console.log("FINISH");
                return active;
            }else{
                // console.log("Queue: " + queue);
                // console.log("History: " + history);
                // console.log("not finished");
                var nextNodes = possibleNodes(graphMap, active.current);
                // console.log("Possibilities calculated:");
                // console.log(nextNodes);
                for(let i = 0; i < nextNodes.length; i++){
                    if(!isExist(history, active)){
                        //console.log("New node acquired");
                        //queue.push(createPath(active, nextNodes[i].current, nextNodes[i].value + active.value));
                        enqueue(queue, createPath(active, nextNodes[i].current, nextNodes[i].value + active.value));
                        //console.log(queue);
                        //queue.enqueue(new Path(active, nextNodes[i].current, nextNodes[i].value + active.value));
                        //console.log("MASUK");
                    }
    
                }
            }
        }
    }

    compute(start, end, func(graph), search, method);

}