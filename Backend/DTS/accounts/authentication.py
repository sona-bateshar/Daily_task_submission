

# ================================
# STEP 5: UPDATE URLs
# ================================


# ================================
# STEP 6: RUN MIGRATIONS
# ================================

# Run these commands in terminal:
# python manage.py makemigrations
# python manage.py migrate

# ================================
# STEP 7: CLIENT-SIDE USAGE EXAMPLES
# ================================

"""
WEB CLIENT (JavaScript):

// Login
fetch('/api/auth/login/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: include cookies
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
    })
})
.then(response => response.json())
.then(data => {
    console.log('Login successful:', data);
    // JWT cookies are automatically set by browser
});

// Making authenticated requests
fetch('/api/some-protected-endpoint/', {
    method: 'GET',
    credentials: 'include', // Important: include cookies
})
.then(response => response.json())
.then(data => console.log(data));

// Logout
fetch('/api/auth/logout/', {
    method: 'POST',
    credentials: 'include',
});

// Token refresh (automatic via cookies)
fetch('/api/auth/token/refresh/', {
    method: 'POST',
    credentials: 'include',
});
"""

"""
MOBILE CLIENT (React Native):

import AsyncStorage from '@react-native-async-storage/async-storage';

// Login
const login = async (email, password) => {
    const response = await fetch('http://yourapi.com/api/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Client-Type': 'mobile', // Optional: explicit client type
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Store tokens
        await AsyncStorage.setItem('access_token', data.access);
        await AsyncStorage.setItem('refresh_token', data.refresh);
        return data;
    }
    
    throw new Error(data.detail || 'Login failed');
};

// Making authenticated requests
const makeAuthenticatedRequest = async (endpoint) => {
    const token = await AsyncStorage.getItem('access_token');
    
    return fetch(`http://yourapi.com${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Client-Type': 'mobile',
        }
    });
};

// Logout
const logout = async () => {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    
    await fetch('http://yourapi.com/api/auth/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Client-Type': 'mobile',
        },
        body: JSON.stringify({ refresh: refreshToken })
    });
    
    // Clear stored tokens
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
};

// Token refresh
const refreshToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    
    const response = await fetch('http://yourapi.com/api/auth/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Client-Type': 'mobile',
        },
        body: JSON.stringify({ refresh: refreshToken })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        await AsyncStorage.setItem('access_token', data.access);
        if (data.refresh) {
            await AsyncStorage.setItem('refresh_token', data.refresh);
        }
        return data;
    }
    
    throw new Error('Token refresh failed');
};
"""

# ================================
# STEP 8: TESTING YOUR SETUP
# ================================

"""
Test with curl:

# Test mobile login
curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -H "X-Client-Type: mobile" \
    -d '{"email":"test@example.com","password":"testpass123"}'

# Test web login (with cookies)
curl -X POST http://localhost:8000/api/auth/login/ \
    -H "Content-Type: application/json" \
    -c cookies.txt \
    -d '{"email":"test@example.com","password":"testpass123"}'

# Test authenticated request (mobile)
curl -X GET http://localhost:8000/api/auth/user/ \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    -H "X-Client-Type: mobile"

# Test authenticated request (web)
curl -X GET http://localhost:8000/api/auth/user/ \
    -b cookies.txt
"""

# ================================
# STEP 9: DEBUGGING VIEW (Optional)
# ================================

# Add this to your views.py for debugging
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class ClientTypeDebugView(APIView):
    """Debug endpoint to see how your client is detected"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        from .views import HybridLoginView
        
        hybrid_view = HybridLoginView()
        client_type = hybrid_view.detect_client_type(request)
        
        return Response({
            'detected_client_type': client_type,
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'x_client_type': request.META.get('HTTP_X_CLIENT_TYPE', ''),
            'headers': dict(request.META),
        })

# Add to urls.py:
# path('auth/debug/client-type/', ClientTypeDebugView.as_view(), name='debug_client_type'),