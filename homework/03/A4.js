let number=[1,2,3,4,5,6,7,8,9];
let a=[];
for(let i=0;i<number.length;i++)
    if(number[i]%2!=0) a.push(number[i]);
console.log(a)
/*
for(let i=0;i<a.length;i++)
    console.log("a[%d]=%d", i, a[i]);
*/