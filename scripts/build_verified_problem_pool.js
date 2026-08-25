const fs = require('fs');
const path = require('path');

const realLeetcode = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/leetcode_real_problems.json'), 'utf8'));

console.log(`Total real LeetCode problems in pool: ${realLeetcode.length}`);

// We can classify real problems into categories based on title keywords and known problem mappings
function classifyTopic(p) {
  const t = p.title.toLowerCase();
  const s = p.slug.toLowerCase();

  // Segment Tree
  if (t.includes('segment tree') || s.includes('segment-tree') || t.includes('range sum query') || t.includes('count of smaller numbers after self') || t.includes('falling squares') || t.includes('my calendar iii')) {
    return 'Segment Tree';
  }

  // Geometry
  if (t.includes('rectangle') || t.includes('convex hull') || s.includes('geometry') || t.includes('point') || t.includes('angle') || t.includes('area') || t.includes('circle') || t.includes('line') || t.includes('polygon') || t.includes('triangulation') || t.includes('projection') || t.includes('surface area') || t.includes('max points on a line') || t.includes('valid boomerang') || t.includes('queries on number of points inside a circle')) {
    return 'Geometry';
  }

  // Union Find / DSU
  if (t.includes('union find') || s.includes('union-find') || t.includes('disjoint set') || t.includes('redundant connection') || t.includes('accounts merge') || t.includes('regions cut by slashes') || t.includes('number of operations to make network connected') || t.includes('satisfiability of equality equations') || t.includes('smallest string with swaps') || t.includes('evaluate division') || t.includes('most stones removed') || t.includes('lexicographically smallest equivalent string') || t.includes('checking existence of edge length limited paths') || t.includes('find all people with secret')) {
    return 'Union Find';
  }

  // Trie
  if (t.includes('trie') || s.includes('trie') || t.includes('prefix tree') || t.includes('word search ii') || t.includes('replace words') || t.includes('map sum pairs') || t.includes('index pairs of a string') || t.includes('magic dictionary') || t.includes('short encoding of words') || t.includes('design add and search words data structure') || t.includes('stream of characters') || t.includes('maximum xor of two numbers in an array') || t.includes('word break ii') || t.includes('search suggestions system') || t.includes('longest word in dictionary')) {
    return 'Trie';
  }

  // BFS
  if (t.includes('bfs') || s.includes('bfs') || t.includes('breadth') || t.includes('shortest path in binary matrix') || t.includes('word ladder') || t.includes('open the lock') || t.includes('snakes and ladders') || t.includes('minimum knight moves') || t.includes('bus routes') || t.includes('cut off trees for golf event') || t.includes('shortest path visiting all nodes') || t.includes('as far from land as possible') || t.includes('walls and gates') || t.includes('nearest exit from entrance in maze') || t.includes('sliding puzzle') || t.includes('minimum genetic mutation') || t.includes('web crawler multithreaded') || t.includes('amount of time for binary tree to be infected')) {
    return 'BFS';
  }

  // Queue
  if (t.includes('queue') || s.includes('queue') || t.includes('circular queue') || t.includes('dota2 senate') || t.includes('number of recent calls') || t.includes('moving average from data stream') || t.includes('design circular deque') || t.includes('first unique number') || t.includes('reveal cards in increasing order') || t.includes('task scheduler') || t.includes('stamping the sequence') || t.includes('find the winner of the circular game')) {
    return 'Queue';
  }

  // Simulation
  if (t.includes('simulation') || s.includes('simulation') || t.includes('robot bounded in circle') || t.includes('spiral matrix') || t.includes('game of life') || t.includes('where will the ball fall') || t.includes('fizz buzz') || t.includes('baseball game') || t.includes('astroid collision') || t.includes('tictactoe') || t.includes('snake game') || t.includes('design parking system') || t.includes('walking robot simulation') || t.includes('min stack') || t.includes('time needed to buy tickets') || t.includes('count collisions on a road') || t.includes('execution of all suffix instructions staying in a grid')) {
    return 'Simulation';
  }

  // Sort / Sorting
  if (t.includes('sort') || s.includes('sort') || t.includes('merge interval') || t.includes('custom sort string') || t.includes('relative sort array') || t.includes('sort colors') || t.includes('largest number') || t.includes('insertion sort list') || t.includes('sort an array') || t.includes('wiggle sort') || t.includes('sort characters by frequency') || t.includes('h-index') || t.includes('sort array by parity') || t.includes('minimum number of moves to seat everyone') || t.includes('sorting the sentence') || t.includes('sort the people')) {
    return 'Sort';
  }

  // Graphs
  if (t.includes('graph') || s.includes('graph') || t.includes('clone graph') || t.includes('course schedule') || t.includes('network delay time') || t.includes('cheapest flights within k stops') || t.includes('path with minimum effort') || t.includes('all paths from source to target') || t.includes('is graph bipartite') || t.includes('keys and rooms') || t.includes('minimum height trees') || t.includes('reconstruct itinerary') || t.includes('dijkstra') || t.includes('topological') || t.includes('critical connections in a network') || t.includes('find eventual safe states') || t.includes('loud and rich') || t.includes('minimum cost to connect all points') || t.includes('swim in rising water') || t.includes('alien dictionary') || t.includes('time needed to inform all employees')) {
    return 'Graphs';
  }

  // Greedy
  if (t.includes('greedy') || s.includes('greedy') || t.includes('jump game') || t.includes('gas station') || t.includes('candy') || t.includes('assign cookies') || t.includes('non-overlapping intervals') || t.includes('minimum number of arrows to burst balloons') || t.includes('partition labels') || t.includes('lemonade change') || t.includes('task scheduler') || t.includes('reorganize string') || t.includes('boat') || t.includes('car pooling') || t.includes('two city scheduling') || t.includes('dota2 senate') || t.includes('bag of tokens') || t.includes('hand of straights') || t.includes('reduce array size to the half') || t.includes('minimum deletions to make character frequencies unique')) {
    return 'Greedy';
  }

  // Default fallback to title inference
  return null;
}

const categorized = {};
realLeetcode.forEach(p => {
  const cat = classifyTopic(p);
  if (cat) {
    categorized[cat] = (categorized[cat] || 0) + 1;
  }
});

console.log('Classified count for target weak categories:', categorized);
