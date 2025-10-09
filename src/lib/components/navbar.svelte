<script lang="ts">
    import logo from "$lib/images/logos/safe-harbor.png";
</script>

<div class="nav rounded shadow">
    <nav class="navbar navbar-expand-md navbar-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/" aria-label="Skylock Home">
                <img src={logo} alt="Logo" class="d-inline-block align-text-top" />
            </a>

            <!-- Hamburger menu toggle button for mobile -->
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://frameworks.securityalliance.org/safe-harbor/overview"
                            >Documentation</a
                        >
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/adoption">Adoption</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</div>

<style>
    .nav {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 60px);
        top: 30px;
        z-index: 1000;

        .navbar {
            width: 100%;
        }

        .navbar-brand {
            img {
                width: auto;
                height: 30px;
            }
        }

        a {
            font-family: "Hind", sans-serif;
            font-weight: 600;
            color: var(--text-tertiary);
            &:hover {
                color: var(--text-secondary);
                text-decoration: none;
            }
        }

        @media (max-width: 768px) {
            ul a {
                padding: 20px 0;
                padding-left: 10px;
                border-bottom: var(--hover) 1px solid;

                &:hover {
                    background-color: #f8f9fa;
                }
            }
        }
    }
</style>
