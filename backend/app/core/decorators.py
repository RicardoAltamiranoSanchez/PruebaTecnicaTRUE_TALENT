import functools
import logging
import time
import inspect

# Configurar logger básico
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("API_LOGGER")

def log_execution(show_logs: bool = True):
    """
    Decorador para loguear la ejecución de endpoints.
    
    Args:
        show_logs (bool): Si es True, imprime los logs de inicio, fin y errores.
                          Si es False, ejecuta la función sin loguear nada.
    """
    def decorator(func):
        if not show_logs:
            return func

        # Wrapper para funciones asíncronas (async def)
        if inspect.iscoroutinefunction(func):
            @functools.wraps(func)
            async def async_wrapper(*args, **kwargs):
                start_time = time.time()
                logger.info(f"➡️ [START] Endpoint: {func.__name__} | Args: {kwargs.keys()}")
                try:
                    result = await func(*args, **kwargs)
                    elapsed = time.time() - start_time
                    logger.info(f"✅ [SUCCESS] Endpoint: {func.__name__} | Took: {elapsed:.4f}s")
                    return result
                except Exception as e:
                    logger.error(f"❌ [ERROR] Endpoint: {func.__name__} | Details: {str(e)}")
                    raise e
            return async_wrapper
            
        # Wrapper para funciones síncronas (def)
        else:
            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                start_time = time.time()
                logger.info(f"➡️ [START] Endpoint: {func.__name__} | Args: {kwargs.keys()}")
                try:
                    result = func(*args, **kwargs)
                    elapsed = time.time() - start_time
                    logger.info(f"✅ [SUCCESS] Endpoint: {func.__name__} | Took: {elapsed:.4f}s")
                    return result
                except Exception as e:
                    logger.error(f"❌ [ERROR] Endpoint: {func.__name__} | Details: {str(e)}")
                    raise e
            return sync_wrapper
            
    return decorator
