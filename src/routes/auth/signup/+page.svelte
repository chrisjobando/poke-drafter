<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<div class="card">
	<h1 class="card-title">Sign Up</h1>

	<form class="card-body">
		<label class="label-text" for="email">Email</label>
		<input class="input input-bordered" name="email" type="email" />

		<label class="label-text" for="password">Password</label>
		<input class="input input-bordered" name="password" type="password" />

		<label class="label-text" for="confirm_password">Confirm Password</label>
		<input class="input input-bordered" type="password" name="confirm_password" />

		<a href="/auth/create-profile" class="btn btn-primary">Submit</a>
		<p>Already have an account? <a class="text-primary" href="/auth/signin">Sign in</a></p>
	</form>
</div>
