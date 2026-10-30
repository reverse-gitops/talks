// Slide order. Each slide folder holds:
//   slide.html  the markup (one 1600×900 root with data-anim-root)
//   slide.css   the slide's own keyframes and animation classes
//   index.js    timing, step labels and optional hooks (extraState, vals, vars, onFrame)
import problem from './problem/index.js';
import bigPicture from './big-picture/index.js';
import modeling from './modeling/index.js';
import insideKcp from './inside-kcp/index.js';
import twoStreams from './two-streams/index.js';
import commitRequest from './commit-request/index.js';
import delivery from './delivery/index.js';

export default [problem, bigPicture, modeling, insideKcp, twoStreams, commitRequest, delivery];
