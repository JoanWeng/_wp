function factorial(n)
{
    if(n==1) return 1;
    else if(n==0) return 1;
    else return n*factorial(n-1);
}
console.log("factorial(5)=", factorial(5));