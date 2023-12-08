#include <iostream>
#include <stack>

using namespace std;

int maxRectangleArea(int A[], int n) {
    stack<int> s;
    int maxArea = 0;
    int i = 0;

    while (i < n) {
        if (s.empty() || A[i] >= A[s.top()]) {
            s.push(i++);
        } else {
            int top = s.top();
            s.pop();
            int width = s.empty() ? i : i - s.top() - 1;
            maxArea = max(maxArea, A[top] * width);
        }
    }

    while (!s.empty()) {
        int top = s.top();
        s.pop();
        int width = s.empty() ? i : i - s.top() - 1;
        maxArea = max(maxArea, A[top] * width);
    }

    return maxArea;
}

int main() {
    int A[] = {5, 6, 7, 4, 1};
    int n = sizeof(A) / sizeof(A[0]);
    
    int result = maxRectangleArea(A, n);
    cout << result << endl;

    return 0;
}
