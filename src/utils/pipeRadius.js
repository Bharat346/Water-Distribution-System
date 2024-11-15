export default function calc_pipe_radius (Q) {
    let velocity = [5,6,7,8,9,10,11,12,13,14,15];
    let weight = [1,1,1,1,1,1,1.2,1.6,2,2.2,2.5];

    let res = 0;
    let n = velocity.length;

    for (let i = 0; i < n; i++) {
        let exp = Q / (3.14 * velocity[i]);
        res += Math.sqrt(exp) * weight[i];
    }

    res = res / 15.5
    return res.toFixed(2);
}

