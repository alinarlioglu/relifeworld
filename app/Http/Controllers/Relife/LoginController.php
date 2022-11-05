<?php


namespace App\Http\Controllers\Relife;


use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request as Req;

class LoginController extends Controller
{
    use AuthenticatesUsers {
        login as peformLogin;
        logout as performLogout;
    }

    //Redirecting users to here after login.
    protected $redirectTo = '/home';

    public function login(Req $request)
    {
        if (auth()->guard('members')->attempt(['email' => $request->email, 'password' => $request->password])) {
            //Retrieving the logged in user's data.
            Session::put('memberData', auth()->guard('members')->user());
            return response()->json(['status' => true, 'data' => ['login' => true]]);
        }
        return response()->json(['status' => false, 'data' => ['login' => false]]);
    }

    public function logout(Request $request)
    {
        //Checking if the logged in user has a session data.
        if(Session::has('memberData')) {
            //Removing the logged in user's data.
            Session::forget('memberData');
        }
        //Performing a logout.
        $this->guard('members')->logout();
        //$request->session()->invalidate();
        return response()->json(['status' => true, 'data' => ['logout' => true]]);
    }
}
