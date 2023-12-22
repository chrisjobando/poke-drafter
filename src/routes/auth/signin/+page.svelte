<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="card">
	<h1 class="card-title">Sign In</h1>

	<form class="card-body">
		<label class="label-text" for="email">Email</label>
		<input class="input input-bordered" name="email" type="email" />

		<label class="label-text" for="password">Password</label>
		<input class="input input-bordered" name="password" type="password" />

		<a href="/" class="btn btn-primary">Submit</a>
		<p>
			Don't have an account? <a class="text-primary" href="/auth/signup">Create a new account</a>
		</p>
	</form>
</div>
